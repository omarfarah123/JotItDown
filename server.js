const notes = "./db/db.json"
const express = require('express');
const path = require('path');
const fs = require('fs');

const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
//Sends index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
//Sends notes.html to server
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
//Gets all of the notes inside db.json
app.get('/api/notes', function (req, res) {
    try {
		fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8' , (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            res.json(JSON.parse(data))
          });
	} catch (error) {
		res.send("Problem retrieving notes", error)
	}
})

//Post route for adding new notes
app.post('/api/notes', function (req, res) {
    try{
      console.log("Hit the post route")
      const { title, text } = req.body;
    
      if (title && text) {
        
        const newNote = {
          title,
          text,
          note_id: uuid(),
        };
        console.log(newNote);
              // Obtain existing notes
        fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
          if (err) {
            console.error(err);
          } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);
  
            parsedNotes.push(newNote);
  
            // Write updated notes back to file
            fs.writeFile(
              path.join(__dirname, '/db/db.json'),
              JSON.stringify(parsedNotes, null, 4),
              (writeErr) =>
                writeErr
                  ? console.error(writeErr)
                  : console.info('Successfully updated notes!')
            );
          }
        });
    
        const response = {
          status: 'success',
          body: newNote,
        };
    
        console.log(response);
        res.json(response);
      }
    } catch (error) {
      res.json("problem adding note")
    }
  })



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);