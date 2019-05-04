const express = require('express');
const actionHelper = require('../data/helpers/actionModel')
const router = express.Router();

router.use(express.json());

const sendUserError = (status, message, res) => {
    res.status(status).json({ errorMessage: message });
    return;
  };

  router.get('/', (req, res) => {
    actionHelper.get()
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(err => {
        res.status(500).json({error: "The actions information could not be retrieved"})
    })
})

router.get('/:id', (req, res) => {
    const actionId = req.params.id;
    actionHelper.get(actionId)
    .then(action => {
        if(!action){
            res.status(404).json({message: "The action with the specified ID does not exist."})
            return;
        }
        res.status(200).json(action)
    })
    .catch(err => {
        res.status(500).json({error: "The action information could not be retrieved"})
    })
})

router.post('/', (req, res) => {
    const {project_id, description, notes} = req.body
    const actionInfo = req.body;
    if(project_id && description && notes){
        actionHelper.insert(actionInfo)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(err => {
            res.status(500).json({error: err, errorMessage: "There was an error saving the action to the database"})
        })
    }  else {
        res.status(400).json({errorMessage: "Please provide a project id, a description, and notes for your action"})
    }
})

router.put('/:id', (req, res) => {
    const actionId = req.params.id;
    const {project_id, description, notes} = req.body
    const actionInfo = req.body;
    if(!project_id || !description || !notes) {
        sendUserError(400, "Please provide a a project id, description, and notes for the action to be updated with.", res);
        return;
    }
    actionHelper.update(actionId, {project_id, description, notes})
    .then(action => {
        if(!action) {
            sendUserError(404, "Action with specified ID does not exist", res);
            return;
        }
    })
    .catch(err => {
        sendUserError(500, "Action information could not be modifed", err)
    })
    actionHelper.get(actionId)
    .then(action => {
        if(!action) {
            sendUserError(404, 'Action with specified ID not found', res);
            return;
        }
        res.status(200).json(action)
    })
})

router.delete('/:id', (req, res) => {
    const actionId = req.params.id;
    actionHelper.remove(actionId)
    .then(action => {
        if(!action) {
            res.status(404).json({message: "The action with the specified ID does not exist." })
            return;
        }
        res.status(200).json({message: `action ${actionId} has successfully been deleted`})
    })
    .catch(err => {
        console.log("error:", err);
        res.status(500).json({error: "The action could not be removed"})
    })
})

module.exports = router;