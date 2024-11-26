import { prisma } from "@/lib/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { options } from "./auth/[...nextauth]";

export default async function GuestbookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (message === "")
      return res
        .status(400)
        .json({
          status_code: 400,
          message: "Bad request! Don't submit any empty message!",
        });

    const session = await getServerSession(req, res, options);

    await prisma.guestbook.create({
      data: {
        message,
        username: session?.user.name as string,
        email: session?.user.email as string,
      },
    });

    return res
      .status(201)
      .json({ status_code: 201, message: "Success create new message!" });
  } else if (req.method === "GET") {
    const data = await prisma.guestbook.findMany({
      select: {
        id: true,
        created_at: true,
        email: false,
        username: true,
        message: true,
      },
    });

    return res.status(200).json({
      status_code: 200,
      message: "Success get messages list!",
      data,
    });
  } else {
    return res.status(405).json({
      status_code: 405,
      message: "Method not allowed! You should only use POST method",
    });
  }
}
