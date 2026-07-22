import express, { Request, Response } from 'express';
import { blockController, collectionController, entryController } from '@core/admin/controllers';
import {createPassword, findUsername, loadUsers, verifyPassword} from '@core/services/userService';
import fs from 'fs-extra';
import path from "path";
import {LoginRequest} from "@core/requests/routes/loginRequest";
import {RegisterRequest} from "@core/requests/routes/registerRequest";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
// import {isAuthenticated} from '@core/admin/middlewares/isAuthenticated';

const router = express.Router();

router.get('/login', (req: Request, res: Response) => {
  res.render('admin/pages/login', {
    username: ''
  });
});

  router.post('/login', async (
      req: Request<object, object, LoginRequest>,
      res: Response
  ): Promise<void> => {
    const { username, password } = req.body;

    await loadUsers();

    const user = findUsername(username);
    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).render('admin/pages/login', {
        error: ReasonPhrases.BAD_REQUEST,
        username,
      });
      return;
    }

    const passwordValid = await verifyPassword(user, password);
    if (!passwordValid) {
      res.status(StatusCodes.BAD_REQUEST).render('admin/pages/login', {
        error: ReasonPhrases.BAD_REQUEST,
        username,
      });
      return;
    }

    req.session.user = {
      username: user.username,
      role: user.role
    };

    res.redirect('/admin/');
    return;
  });


router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/')
  });
});

// -------------------- //

router.get('/register', (req: Request, res: Response) => {
  res.render('admin/pages/register', {
    email: '',
    username: ''
  });
});

router.post('/register', async (req: Request<object, object, RegisterRequest>, res: Response) => {
  const { email, username, password } = req.body;

  await loadUsers();


  // TODO: Fix account already exists
  // const usernameIsRecognised = findUsername(username);
  // const emailIsRecognised = findEmail(email);
  //
  // let errorCode: string | null = null;

  // if (emailIsRecognised) {
  //   errorCode = StatusCodes.NOT_FOUND;
  // } else if (usernameIsRecognised) {
  //   errorCode = 'TEP122';
  // }
  //
  // if (errorCode) {
  //   res.status(401).render('admin/pages/register', { error: getErrorMessage(errorCode), username, email });
  //   return;
  // }

  try {
    const userPath = path.join(process.cwd(), 'src', 'content', 'users');

    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, {recursive: true});
    }

    const safeUsername = username
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '');

    const filePath = path.join(userPath, `${safeUsername}.json`);

    const userData = {
      username: username,
      passwordHash: await createPassword(password),
      role: 'admin',
      email: email
    };

    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8');
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).render('admin/pages/register', {
      error: ReasonPhrases.UNAUTHORIZED
    });
    return;
  }

  res.status(StatusCodes.OK).redirect('/admin/login');
  return;
});

// -------------------- //

// router.use(isAuthenticated);

router.get('/', (req: Request, res: Response) => {
  res.render('admin/pages/dashboard', { user: req.session.user });
});

// --------- Collections ----------- //
router.get('/collections', collectionController.list)

router.get('/collections/create', collectionController.createForm)
router.post('/collections/create', collectionController.create)

router.get('/collections/:collection/edit', collectionController.editForm)
router.post('/collections/:collection/edit', collectionController.edit)

router.get('/collections/:collection/delete', collectionController.delete)

// --------- Entries ----------- //
router.get('/collections/:collection/entries', entryController.list)

router.get('/collections/:collection/entries/create', entryController.createForm)
router.post('/collections/:collection/entries/create', entryController.create)

router.get('/collections/:collection/entries/:entry/edit', entryController.editForm)
router.post('/collections/:collection/entries/:entry/edit', entryController.edit)

router.get('/collections/:collection/entries/:entry/delete', entryController.delete)

router.get('/collections/:collection/entries/:entry', entryController.view)

// --------- Blocks ----------- //
router.get('/blocks', blockController.list)

router.get('/blocks/create', blockController.createForm)
router.post('/blocks/create', blockController.create)

router.get('/blocks/:block/edit', blockController.editForm)
router.post('/blocks/:block/edit', blockController.edit)

// router.get('/collections/:blocks/delete', blockController.delete)

// --------- CatchAll ----------- //

router.use('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).render('views/404', {
    user: req.session.user, errors:
    ReasonPhrases.NOT_FOUND
  });
});

// -------------------- //

export default router;
