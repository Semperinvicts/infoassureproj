
const express = require ("express");
const dotenv = require ("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();
const app = express();

const PORT = 3000;

const supabase = createClient('https://yydsvsxwfmmbqulksijf.supabase.co', 'sb_publishable_0c0LrkdSnFu0j7LPSwLkzA_X1YThzmp');

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Frontend.html"));
}
);

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                display_name: name
            }
        }
    });

    if (error) {
        console.log(`login error: ${error}`)
    }

    console.log(`Welcome ${data.user.user_metadata.display_name}!`)

    console.log("signup reached here");
    //add the error handling and success page here 
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({email, password}) 
    //add the error handling and success page here

    res.cookie("access_token", data.session.access_token, { httpOnly: true });
});

app.post("/googleSSO", async (req, res) => {

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    })

    res.cookie("access_token", data.session.access_token, { httpOnly: true });

    //add the error handling and success page here

});

app.post("/appleSSO", async (req, res) => {

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
    })

    res.cookie("access_token", data.session.access_token, { httpOnly: true });

    //add the error handling and success page here

});

app.get("/private", async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.redirect("/");

    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.redirect("/");

    const filePath = path.join(__dirname, "private.html");
    
    //add user data in the html or something 
});

app.get("/logout", (req, res) => {+
    res.clearCookie("access_token");
    res.redirect("/")
})

app.listen(PORT,
     () => {
    console.log(`Server running at http:/localhost:${PORT}/`);
});