import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import { errorHandler, NotFoundError, currentUser } from "@wawatickets/common";

import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
// app.set('trust proxy', true); // for k8s
app.use(json());
app.use(cors());
app.use(
    // for k8s
    cookieSession({
        signed: false,
        // secure: process.env.NODE_ENV !== 'test' // for k8s
        // secure: true // for normal browser
    })
    // cookieSession({
    //     keys: ['sdovjisd']
    // })
);

app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };