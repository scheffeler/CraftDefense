import { Game } from "./Game";
import "./style.css";

const app = document.getElementById("app");
if (!app) throw new Error("No #app element found");

const game = new Game(app);
game.start();
