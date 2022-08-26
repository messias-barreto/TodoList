import express from "express";
import { AppDataSource } from "./database/data-source";
import { routes } from "./routes/routes";
import cors from 'cors';


AppDataSource.initialize()
    .then(() => {
        const app = express();
        const corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200
        };

        app.use(express.json());
        app.use(cors(corsOptions))
        app.use(routes);

        app.listen(process.env.PORT, () => { console.log('server is running'); })
    })

    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

