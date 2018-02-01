const keys = require('../../config/keys');

module.exports = (user) => {
  return `
    <html>
     <body>
      <div style="text-align: center;">
        <h3>Registration</h3>
        <p>Click on a link below to confirm your registration: </p>
        <p><br /></p>
        <div>
          <a href="${keys.redirectDomain}/users/confirmation/${user.id}">Confirm</a>
        </div>
      </div>
     </body>
    </html>
  `;
}