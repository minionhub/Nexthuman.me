import React from 'react';
import { useFirebase } from 'react-redux-firebase';
import { Editor } from '@tinymce/tinymce-react';
import { makeStyles, useTheme, FormHelperText } from '@material-ui/core';
import LoadingOverlay from '../LoadingOverlay';

export default ({
  value,
  onChange,
  loading = false,
  allMentions = [],
  placeholder = '',
  resizable = false,
  height,
  error = false,
  helperText = '',
  ...props
} = {}) => {
  const useStyles = makeStyles({
    root: {
      position: 'relative',
      minHeight: '200px',
      '& .tox-tinymce': {
        minHeight: '200px',
        borderRadius: '3px',
      },
      '& .tox-statusbar': {
        display: resizable ? 'flex' : 'none !important',
        borderTop: 'none !important',
        '& .tox-statusbar__text-container': {
          display: 'none',
        },
      },
    },
    hasError: {
      '& .tox-tinymce': {
        borderColor: '#E84545 !important',
      },
    },
  });

  const classes = useStyles({ theme: useTheme() });
  const firebase = useFirebase();

  const handleEditorChange = (content, editor) => {
    onChange && onChange(content);
  };

  const getStorageToken = async (success, failure) => {
    try {
      const getToken = firebase.functions().httpsCallable('getStorageToken');
      const result = await getToken();
      success(result.data);
    } catch (e) {
      failure('Failed to fetch storage token');
    }
  };

  const rootClasses = [classes.root];
  if (!!error) rootClasses.push(classes.hasError);

  return (
    <div className={rootClasses.join([' '])} {...props}>
      {loading ? (
        <LoadingOverlay />
      ) : (
        <>
          <Editor
            id="mention-tinymce-editor"
            apiKey="vxqcdyg9dfynhsytsnev7xik3gye47sohbnp9kgpsrwrmjyc"
            value={value}
            init={{
              placeholder: placeholder,
              height: height || 400,
              menubar: true,
              plugins:
                'tinydrive print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
              toolbar:
                'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
              toolbar_sticky: true,
              tinydrive_token_provider: getStorageToken,
              content_style: `
              .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                color: rgba(51, 51, 51, 0.45);              
              }
              .mention-tag {
                position: relative;
                cursor: pointer;
                color: #6A2C70;
                font-weight: 600;
                text-decoration: none !important;              
              }
            `,
              setup: function (editor) {
                var onAction = function (autocompleteApi, rng, value) {
                  editor.selection.setRng(rng);
                  editor.insertContent(value);
                  autocompleteApi.hide();
                };

                editor.ui.registry.addAutocompleter('story-mentions', {
                  ch: '@',
                  minChars: 1,
                  columns: 1,
                  highlightOn: ['name'],
                  onAction: onAction,
                  fetch: function (pattern) {
                    return new window.tinymce.util.Promise(function (resolve) {
                      const filteredMentions = [];
                      allMentions.forEach((mentionItem) => {
                        if (
                          mentionItem.name &&
                          mentionItem.name.toLowerCase().indexOf(pattern.toLowerCase()) >= 0
                        ) {
                          filteredMentions.push({
                            type: 'cardmenuitem',
                            value: `<a class="mention-tag" href="/${
                              mentionItem.type === 'event' ? 'events' : mentionItem.type
                            }/${mentionItem.id}" data-${mentionItem.type}id="${
                              mentionItem.id
                            }" contenteditable="false">${mentionItem.name}</a> `,
                            label: mentionItem.name,
                            items: [
                              {
                                type: 'cardcontainer',
                                direction: 'left',
                                items: [
                                  {
                                    type: 'cardtext',
                                    text: mentionItem.name,
                                    name: 'name',
                                  },
                                  {
                                    type: 'cardtext',
                                    text: mentionItem.type,
                                  },
                                ],
                              },
                            ],
                          });
                        }
                      });
                      resolve(filteredMentions);
                    });
                  },
                });
              },
            }}
            onEditorChange={handleEditorChange}
          />
          {!!error && <FormHelperText error>{helperText}</FormHelperText>}
        </>
      )}
    </div>
  );
};
