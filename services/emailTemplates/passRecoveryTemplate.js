const keys = require('../../config/keys');

module.exports = (user) => {
  return `
    <html>
     <body>
      <div style="text-align: center;">
        <h3>Password recovery on GameStreamer App</h3>
        <p>Click on a link below to visit the password recovery page: </p>
        <p><br /></p>
        <div>
          <a href="${keys.redirectDomain}/users/password-recovery/${user.id}">Yes</a>
        </div>
      </div>
     </body>
    </html>
  `;
}