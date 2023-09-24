const Router = require('express');
const router = new Router();
const entityController = require('../controller/entity.controller');

router.post('/entity', entityController.createEntity);
router.get('/entity', entityController.getEntities);
router.get('/entity/:from', entityController.getNEntsFrom);
router.get('/filtered', entityController.getFiltered);
router.get('/last', entityController.getLast);
router.put('/entity/:id', entityController.updateEntity);
router.delete('/entity/:id', entityController.deleteEntity);

module.exports = router;