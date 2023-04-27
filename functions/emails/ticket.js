const moment = require('moment');

exports.ticketTemplate = (ticket) => {
  var html = `<html>
    <head>
      <title>Ticket</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        * {
          box-sizing: border-box;
        }
        .content {
          width: 600px;
          margin: 0 auto;
          padding: 40px 0;
          font-family: "Arial";
          color: #333333;
        }
        @media (max-width: 671px) {
          .content {
            padding: 40px 20px;
            width: 100%;
          }
        }
        .w-100 {
          width: 100% !important;
          display: inline-block;
        }
        .text-primary {
          color: #283c63 !important;
        }
        .bg-primary {
          background: #283c63 !important;
        }
        .text-secondary {
          color: #6a2c70 !important;
        }
        .text-sm {
          font-size: 13px;
        }
        .text-md {
          font-size: 17px;
          line-height: 24px;
        }
        .text-lg {
          font-size: 20px;
        }
        .text-xl {
          font-size: 24px;
        }
        .text-xxl {
          font-size: 34px;
        }
        .radius {
          border-radius: 8px;
        }
        .mb {
          margin-bottom: 40px;
        }
        a {
          text-decoration: none;
        }
        p {
          margin: 0;
          padding: 0;
        }
        .text-gray {
          color: #828282;
        }
        .float-left {
          float: left;
        }
        .w-50 {
          width: 50%;
          display: block;
          float: left;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="mb w-100">
          <span class="text-xxl text-primary w-50">NextHuman</span>
          <div class="w-50">
            <a
              href="https://nexthuman.me/books"
              class="text-lg text-primary"
              style="margin-right: 10px"
              >Books</a
            >
            <a href="https://nexthuman.me/events" class="text-lg text-primary"
              >Events</a
            >
          </div>
        </div>
        <div
          class="w-100 bg-primary mb"
          style="padding: 55px 0; text-align: center"
        >
          <h1 class="text-xxl" style="color: #fff; font-weight: 400; margin: 0">
            Booking Confirmation
          </h1>
        </div>
        <div class="w-100 mb text-md font-lato">
          <p style="margin-bottom: 30px">Hello ${ticket.userName},</p>
          <p>
            We would like to inform you that your booking for
            <a href="#" class="text-primary" style="font-weight: 700"
              >${ticket.eventTitle}</a
            >
            has been confirmed. Below are the booking details.
          </p>
        </div>
        <div class="w-100 mb">
          <img
            class="radius"
            src="${ticket.coverImg}"
            width="100%"
            alt="${ticket.eventTitle}"
          />
        </div>
        <p class="text-xxl text-primary" style="margin-bottom: 10px">
          ${ticket.eventTitle}
        </p>
        <p class="text-xl text-secondary" style="margin-bottom: 24px">
          ${ticket.eventSubtitle}
        </p>
        <div class="w-100">
          <div class="w-50">
            <p class="text-lg text-primary" style="margin-bottom: 18px">Start</p>
            <p style="display: flex; align-items: center; margin-bottom: 10px">
              <span style="margin-right: 10px">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.75 8.25H5.25V9.75H6.75V8.25ZM9.75 8.25H8.25V9.75H9.75V8.25ZM12.75 8.25H11.25V9.75H12.75V8.25ZM14.25 3H13.5V1.5H12V3H6V1.5H4.5V3H3.75C2.9175 3 2.2575 3.675 2.2575 4.5L2.25 15C2.25 15.3978 2.40804 15.7794 2.68934 16.0607C2.97064 16.342 3.35218 16.5 3.75 16.5H14.25C15.075 16.5 15.75 15.825 15.75 15V4.5C15.75 3.675 15.075 3 14.25 3ZM14.25 15H3.75V6.75H14.25V15Z"
                    fill="#6A2C70"
                  />
                </svg>
              </span>
              <span class="font-lato">${moment(ticket.eventFrom).format(
                'dddd, MMM DD, YYYY'
              )}</span>
            </p>
            <p style="display: flex; align-items: center; margin-bottom: 24px">
              <span style="margin-right: 10px">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguOTkyNSAxLjVDNC44NTI1IDEuNSAxLjUgNC44NiAxLjUgOUMxLjUgMTMuMTQgNC44NTI1IDE2LjUgOC45OTI1IDE2LjVDMTMuMTQgMTYuNSAxNi41IDEzLjE0IDE2LjUgOUMxNi41IDQuODYgMTMuMTQgMS41IDguOTkyNSAxLjVaTTkgMTVDNS42ODUgMTUgMyAxMi4zMTUgMyA5QzMgNS42ODUgNS42ODUgMyA5IDNDMTIuMzE1IDMgMTUgNS42ODUgMTUgOUMxNSAxMi4zMTUgMTIuMzE1IDE1IDkgMTVaIiBmaWxsPSIjNkEyQzcwIi8+CjxwYXRoIGQ9Ik05LjM3NSA1LjI1SDguMjVWOS43NUwxMi4xODc1IDEyLjExMjVMMTIuNzUgMTEuMTlMOS4zNzUgOS4xODc1VjUuMjVaIiBmaWxsPSIjNkEyQzcwIi8+Cjwvc3ZnPgo="
                  alt=""
                />
              </span>
              <span class="font-lato">${moment(ticket.eventFrom).format('LT')}</span>
            </p>

            <p class="text-lg text-primary" style="margin-bottom: 18px">End</p>
            <p style="display: flex; align-items: center; margin-bottom: 10px">
              <img src="data:image/svg+xml;base64PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNzUgOC4yNUg1LjI1VjkuNzVINi43NVY4LjI1Wk05Ljc1IDguMjVIOC4yNVY5Ljc1SDkuNzVWOC4yNVpNMTIuNzUgOC4yNUgxMS4yNVY5Ljc1SDEyLjc1VjguMjVaTTE0LjI1IDNIMTMuNVYxLjVIMTJWM0g2VjEuNUg0LjVWM0gzLjc1QzIuOTE3NSAzIDIuMjU3NSAzLjY3NSAyLjI1NzUgNC41TDIuMjUgMTVDMi4yNSAxNS4zOTc4IDIuNDA4MDQgMTUuNzc5NCAyLjY4OTM0IDE2LjA2MDdDMi45NzA2NCAxNi4zNDIgMy4zNTIxOCAxNi41IDMuNzUgMTYuNUgxNC4yNUMxNS4wNzUgMTYuNSAxNS43NSAxNS44MjUgMTUuNzUgMTVWNC41QzE1Ljc1IDMuNjc1IDE1LjA3NSAzIDE0LjI1IDNaTTE0LjI1IDE1SDMuNzVWNi43NUgxNC4yNVYxNVoiIGZpbGw9IiM2QTJDNzAiLz4KPC9zdmc+Cg==" />
              </span>
              <span class="font-lato">${moment(ticket.eventTo).format('dddd, MMM DD, YYYY')}</span>
            </p>
            <p style="display: flex; align-items: center; margin-bottom: 24px">
              <span style="margin-right: 10px">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTguOTkyNSAxLjVDNC44NTI1IDEuNSAxLjUgNC44NiAxLjUgOUMxLjUgMTMuMTQgNC44NTI1IDE2LjUgOC45OTI1IDE2LjVDMTMuMTQgMTYuNSAxNi41IDEzLjE0IDE2LjUgOUMxNi41IDQuODYgMTMuMTQgMS41IDguOTkyNSAxLjVaTTkgMTVDNS42ODUgMTUgMyAxMi4zMTUgMyA5QzMgNS42ODUgNS42ODUgMyA5IDNDMTIuMzE1IDMgMTUgNS42ODUgMTUgOUMxNSAxMi4zMTUgMTIuMzE1IDE1IDkgMTVaIiBmaWxsPSIjNkEyQzcwIi8+CjxwYXRoIGQ9Ik05LjM3NSA1LjI1SDguMjVWOS43NUwxMi4xODc1IDEyLjExMjVMMTIuNzUgMTEuMTlMOS4zNzUgOS4xODc1VjUuMjVaIiBmaWxsPSIjNkEyQzcwIi8+Cjwvc3ZnPgo="
                  alt=""
                />
              </span>
              <span class="font-lato">${moment(ticket.eventTo).format('LT')}</span>
            </p>

            <p class="text-lg text-primary" style="margin-bottom: 18px">
              Participant Character
            </p>
            <div
              class="font-lato"
              style="display: flex; align-items: center; flex-wrap: nowrap"
            >
              <img
                src="${ticket.character.avatar}"
                width="48px"
                height="48px"
                style="
                  object-fit: cover;
                  object-position: center;
                  margin-right: 10px;
                  border-radius: 50%;
                  background: #ddd;
                "
                alt="Character avatar"
              />
              <span>
                <p class="text-md" style="font-weight: 790; margin-bottom: 5px">
                ${ticket.character.name}
                </p>
                <p class="text-sm">${ticket.character.tagline}</p>
              </span>
            </div>
          </div>
          <div class="w-50">
            <p class="text-lg text-primary" style="margin-bottom: 18px">
              Location
            </p>
            <p style="display: flex; align-items: center; margin-bottom: 30px">
              <span style="margin-right: 10px">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMS41QzYuMDk3NSAxLjUgMy43NSAzLjg0NzUgMy43NSA2Ljc1QzMuNzUgMTAuNjg3NSA5IDE2LjUgOSAxNi41QzkgMTYuNSAxNC4yNSAxMC42ODc1IDE0LjI1IDYuNzVDMTQuMjUgMy44NDc1IDExLjkwMjUgMS41IDkgMS41Wk01LjI1IDYuNzVDNS4yNSA0LjY4IDYuOTMgMyA5IDNDMTEuMDcgMyAxMi43NSA0LjY4IDEyLjc1IDYuNzVDMTIuNzUgOC45MSAxMC41OSAxMi4xNDI1IDkgMTQuMTZDNy40NCAxMi4xNTc1IDUuMjUgOC44ODc1IDUuMjUgNi43NVoiIGZpbGw9IiM2QTJDNzAiLz4KPHBhdGggZD0iTTkgOC42MjVDMTAuMDM1NSA4LjYyNSAxMC44NzUgNy43ODU1MyAxMC44NzUgNi43NUMxMC44NzUgNS43MTQ0NyAxMC4wMzU1IDQuODc1IDkgNC44NzVDNy45NjQ0NyA0Ljg3NSA3LjEyNSA1LjcxNDQ3IDcuMTI1IDYuNzVDNy4xMjUgNy43ODU1MyA3Ljk2NDQ3IDguNjI1IDkgOC42MjVaIiBmaWxsPSIjNkEyQzcwIi8+Cjwvc3ZnPgo="
                  alt=""
                />
              </span>
              <span class="font-lato">${ticket.location.name || 'No location specified.'}</span>
            </p>
            ${
              ticket.location.type === 'venue'
                ? `<img
              class="radius"
              src="https://maps.googleapis.com/maps/api/staticmap?center=${ticket.location.center}
              &zoom=13&size=300x200&maptype=roadmap&markers=color:red%7C${ticket.location.lat},
              ${ticket.location.lng}&key=AIzaSyAoyU8HhtUATSgNBBkdNmgOS9qXhQ5p27g"
              width="100%"
              alt="Event location"
            />`
                : ''
            }
          </div>
        </div>

        <div
          class="w-100 radius"
          style="margin: 40px 0; padding: 40px 30px; background: #fafafa"
        >
          <p class="text-primary text-lg mb">Payment Details</p>
          <div
            class="w-100"
            style="margin-bottom: 24px"
          >
            <span class="text-gray w-50">Amount Paid</span>
            <span class="w-50">SEK ${parseInt(ticket.amount)}</span>
          </div>
          <div
            class="w-100"
            style="margin-bottom: 24px"
          >
            <span class="text-gray w-50">Payment Date</span>
            <span class="w-50">${moment(ticket.created).format('MMM DD, YYYY')}</span>
          </div>
          <div
            class="w-100"
            style="margin-bottom: 24px"
          >
            <span class="text-gray w-100">Payment Method</span>
            <span class="w-50">${ticket.cardType} - ${ticket.cardLast4}</span>
          </div>
          <div class="w-100">
            <span class="text-gray w-50">Transaction ID</span>
            <span class="w-50">${ticket.transactionId.slice(-10)}</span>
          </div>
        </div>

        <p style="margin-bottom: 30px">
          If you have any query please contact to our support. See you soon on the
          event. Thank you.
        </p>
        <p style="margin-bottom: 30px">Regards,</p>
        <p class="mb">NextHuman Team.</p>

        <div
          class="bg-primary"
          style="padding: 34px 30px; color: #fff !important"
        >
          <div
            class="w-100"
            style="margin-bottom: 12px"
          >
            <span class="text-lg w-50">NextHuman</span>
            <div class="w-50">
              <a class="text-sm" href="#" style="margin-right: 10px; color: #fff"
                >About</a
              >
              <a class="text-sm" href="#" style="margin-right: 10px; color: #fff"
                >Policy</a
              >
              <a class="text-sm" href="#" style="color: #fff"
                >Terms and Conditions</a
              >
            </div>
          </div>
          <div class="w-100">
            <span class="text-sm w-50">Copyright © 2020 NextHuman</span>
            <a class="text-sm w-50" href="#" style="color: #fff">Unsubscribe</a>
          </div>
        </div>
      </div>
    </body>
  </html>`;

  return html;
};
