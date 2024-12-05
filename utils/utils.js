export function tryCatch(func) {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
}

export function userIsFromIITBhu(email) {
    const domain = email.split("@")[1].trim();
    return domain === "itbhu.ac.in" || domain === "iitbhu.ac.in";
}