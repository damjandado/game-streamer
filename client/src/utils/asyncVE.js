const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default ({ email: testmail }) => {
    console.log('Async E', testmail);
    return sleep(1000) // simulate server latency
        .then(() => {
            const invalidEmails = testmail
                .split(',')
                .map((email) => email.trim())
                .filter((email) => re.test(email) === false);
            console.log('invalidEmails', invalidEmails);
            if (invalidEmails.length) {
                throw { asynce: `These emails are invalid: ${invalidEmails}` };
            }
        });
};
