
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
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Frontend.html"));
}
);

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { display_name: name }
        }
    });

    if (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    }

    console.log("User created, check email for verification");
    return res.redirect("/success");
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({email, password}) 
    //add the error handling and success page here

    if (error) {
        console.log(`error: ${error}`);
        return
    }

    res.cookie("access_token", data.session.access_token, {
        httpOnly: true
    });

    res.redirect("/private");
});

app.post("/googleSSO", async (req, res) => {

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: "http://localhost:3000/callback"
        }        
    })
    if (error) {
        console.log(`error: ${error}`);
        return
    }

    res.redirect(data.url);

    


    //add the error handling and success page here

});

app.post("/appleSSO", async (req, res) => {

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
    })

    res.cookie("access_token", data.session.access_token, { httpOnly: true });

    //add the error handling and success page here

});

app.post("/set-cookie", (req, res) => {
    const { token } = req.body;

    res.cookie("access_token", token, {
        httpOnly: true
    });

    res.sendStatus(200);
});

app.get("/callback", (req, res) => {
    res.sendFile(path.join(__dirname, "public/callback.html"));
});

app.get("/private", async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.redirect("/");

    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.redirect("/");

    const user = data.user;

    let html = fs.readFileSync(
        path.join(__dirname, "private.html"), "utf-8"
    );

    html = html
        .replace("{{name}}", user.user_metadata.display_name || "User")
        .replace("{{email}}", user.email);

    res.send(html);
    
    //add user data in the html or something 
});


app.get("/success", async (req, res) => {

/*     const token = req.cookies.access_token;

    if (!token) return res.redirect("/");
    console.log("Token obtainted");
    const { data, error } = await supabase.auth.getUser(token);
    console.log("data obtained!!!!!!");

    if (error || !data || !data.user) {
        console.log({ data, error });
    };

    if (error || !data?.user) return res.redirect("/");
    console.log("data user obtained!!!!!!");
 */
    const filePath = path.join(__dirname, "public/success.html");

    return res.sendFile(filePath);
});



app.get("/logout", (req, res) => {
    res.clearCookie("access_token");
    res.redirect("/")
})





app.listen(PORT,
     () => {
    console.log(`Server running at http:/localhost:${PORT}/`);
});