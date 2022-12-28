import bcrypt from 'bcryptjs'
const users = [{
        name: "saidoubah",
        email: "saidoubah@gmail.com",
        password: bcrypt.hashSync("passer123", 10),
        isAdmin: true,
    },
    {
        name: "User",
        email: "user@gmail.com",
        password: bcrypt.hashSync("passer123", 10),

    },
];

export default users;