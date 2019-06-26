import { Router } from "express";
import HeroController from "../controllers/HeroController";
// /api/heroes/

const router = Router();

// GET all heroes /api/heroes/
router.get("/", HeroController.listAll);

//Get one hero /api/heroes/id
router.get("/:id([0-9]+)", HeroController.getOneById);

//CREATE a new hero /api/heroes/
router.post("/", HeroController.newHero);

//Edit one hero /api/heroes/id
router.put(
  "/:id([0-9]+)",
  HeroController.editHero
);

//Delete one hero
router.delete(
  "/:id([0-9]+)",
  HeroController.deleteHero
);

export default router;