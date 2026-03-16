import { Router } from "express";


const router = Router()

// -----------Importing Routes----------------


// -----------Mounting Routes----------------
router.route('/register').post(registerUser)