const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json()); //middleware

const PORT = 3000;

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.status(200).send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  // callback is called the route handler
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here..>',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
