const yup = require('yup');
const addUser = yup.object({
    name: yup.string().required("name required").min(3,"min char is 3").max(20,"max char is 20"),
    email: yup.string().required("email required").email("invalid email"),
    password: yup.string().required("password required").min(6,"min char is 6").max(30,"max char is 30"),
    //role: yup.string().required("role required").min(3,"min char is 3").max(20,"max char is 20")
})
module.exports = addUser;