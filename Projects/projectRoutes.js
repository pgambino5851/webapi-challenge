const express = require('express');
const projectHelper = require('../data/helpers/projectModel')
const actionHelper = require('../data/helpers/actionModel')
const router = express.Router();

router.use(express.json());

const sendUserError = (status, message, res) => {
    res.status(status).json({ errorMessage: message });
    return;
  };

  router.get('/', (req, res) => {
    projectHelper.get()
    .then(projects => {
        res.status(200).json(projects)
    })
    .catch(err => {
        res.status(500).json({error: "The projects information could not be retrieved"})
    })
})

router.get('/:id', (req, res) => {
    const projectId = req.params.id;
    projectHelper.get(projectId)
    .then(project => {
        if(!project){
            res.status(404).json({message: "The project with the specified ID does not exist."})
            return;
        }
        res.status(200).json(project)
    })
    .catch(err => {
        res.status(500).json({error: "The project information could not be retrieved"})
    })
})

router.get('/ProjectActions/:id', (req, res) => {
    const projectId = req.params.id;
    projectHelper.get(projectId)
    .then(project => {
        if(!project){
            res.status(404).json({message: "The project with the specified ID does not exist."})
            return;
        }
        projectHelper.getProjectActions(projectId)
        .then(actions => {
            if(actions.length === 0){
                res.status(400).json({message: "There are no actions associated with this project."})
                return;
            }
            res.status(200).json(actions);
        })
    })
})
        
router.post('/', (req, res) => {
    const {name, description} = req.body
    const projectInfo = req.body;
    if(name && description){
        projectHelper.insert(projectInfo)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            res.status(500).json({error: err, errorMessage: "There was an error saving the post to the database"})
        })
    }  else {
        res.status(400).json({errorMessage: "Please provide both a name and description for your project"})
    }
})

router.put('/:id', (req, res) => {
    const projectId = req.params.id;
    const {name, description} = req.body
    const projectInfo = req.body;
    if(!name || !description) {
        sendUserError(400, "Please provide a name and description for the project to be updated with.", res);
        return;
    }
    projectHelper.update(projectId, {name, description})
    .then(project => {
        if(!project) {
            sendUserError(404, "User with specified ID does not exist", res);
            return;
        }
    })
    .catch(err => {
        sendUserError(500, "post information could not be modifed", err)
    })
    projectHelper.get(projectId)
    .then(project => {
        if(!project) {
            sendUserError(404, 'Post with specified ID not found', res);
            return;
        }
        res.status(200).json(project)
    })
})

router.delete('/:id', (req, res) => {
    const projectId = req.params.id;
    projectHelper.remove(projectId)
    .then(project => {
        if(!project) {
            res.status(404).json({message: "The project with the specified ID does not exist." })
            return;
        }
        res.status(200).json({message: `Project ${projectId} has successfully been deleted`})
    })
    .catch(err => {
        console.log("error:", err);
        res.status(500).json({error: "The project could not be removed"})
    })
})

module.exports = router;