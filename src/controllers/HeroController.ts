import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Hero } from "../entity/Hero";

class HeroController{

  static listAll = async (req: Request, res: Response) => {
    //Get heroes from database
    const heroRepository = getRepository(Hero);
    const heroes = await heroRepository.find({
      select: ["id", "name"] 
    });

    //Send the heroes object
    res.send(heroes);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: number = req.params.id;

    //Get the user from database
    const heroRepository = getRepository(Hero);
    try {
      const hero = await heroRepository.findOneOrFail(id, {
        select: ["id", "name"]
      });
      res.send(hero);
    } catch (error) {
      res.status(404).send("Hero not found");
    }
  };

  static newHero = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { id, name } = req.body;
    let hero = new Hero();
    hero.name = name;
    hero.id = id;

    //Validade if the parameters are ok
    const errors = await validate(hero);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    //Try to save. If fails, the Hero id is already in the database
    const heroRepository = getRepository(Hero);
    try {
      await heroRepository.save(hero);
    } catch (e) {
      res.status(409).send(`hero with id:${id} is already in the database`);
      return;
    }

    //If all ok, send 201 response
    res.status(201).send("Hero added");
  };

  static editHero = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    //Get values from the body
    const { name } = req.body;

    //Try to find user on database
    const heroRepository = getRepository(Hero);
    let hero: Hero;
    try {
      hero = await heroRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("Hero not found");
      return;
    }

    //Validate the new values on model
    hero.name = name;
    
    const errors = await validate(hero);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //After all save and send a  response

    await heroRepository.save(hero);
    res.status(201).send(`name of hero with id:${id}  updated to: ${name}`);
  };

  static deleteHero = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const heroRepository = getRepository(Hero);
    let hero: Hero;
    try {
      hero = await heroRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Hero not found");
      return;
    }
    heroRepository.delete(id);

    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
};

export default HeroController;