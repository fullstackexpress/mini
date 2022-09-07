import validator from "validator"
import prisma from "../../libs/prisma"

async function postMethod(req, res) {
  const email = req.body.email

  if (validator.isEmail(email)) {
    try {
      await prisma.user.create({ data: { email } })
      return res.status(200).json({ success: "Zarejestrowałeś się pomyślnie!" })
    } catch (error) {
      console.log(error.meta.target)
      if (error.meta.target === "User_email_key") {
        return res.status(400).json({ error: "Jesteś już zarejestrowany" })
      }
    }
  } else {
    return res.status(400).json({ error: "Nieprawidłowy adres email" })
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case "POST": {
      return await postMethod(req, res)
    }
    default: {
      return res.status(405).json({ error: "Metoda nie obsługiwana" })
    }
  }
}
