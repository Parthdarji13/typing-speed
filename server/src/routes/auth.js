router.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const username =
      name.toLowerCase().replace(/\s+/g, "") + randomString(4);

    const plainPassword = randomString(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 1️⃣ SAVE USER (MAIN SUCCESS)
    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // 2️⃣ SEND RESPONSE IMMEDIATELY
    res.status(201).json({
      message: "Registration successful. Credentials will be sent to your email.",
    });

    // 3️⃣ SEND EMAIL IN BACKGROUND (NON-BLOCKING)
    sendCredentialsEmail(email, username, plainPassword)
      .then(() => {
        console.log("📧 Credentials email sent to", email);
      })
      .catch((err) => {
        console.error("❌ Email sending failed:", err.message);
      });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});
