const express = require('express');
const app     = express();
const conn    = require('./modules/db.js');

const bodyParser = require('body-parser');

app.use(bodyParser());
app.use('/public', express.static('./public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index');
})

app.route('/task').get((req, res) => {
    conn.then(async c => {
        const tasks = await c.query('select * from task_queue');
        res.render('task', { tasks });
    })
}).post((req, res) => {
    const {title, descr, expires, group_type} = req.body;
    let is_head = 1;
    conn.then(async c => {
        let head = await c.query('select * from task_queue where is_head = 1'),
            tail;
        if (head.length !== 0) {
            is_head = 0;
            tail = await c.query('select * from task_queue where next is NULL');
        }

        let insert_result = await c.query('insert into task_queue (title, descr, expires, is_head, group_type) \
                                        values (?, ?, ?, ?, ?)', [title, descr, new Date(expires).toLocaleString(), is_head, group_type]);
        if (tail && tail.length !== 0) {
            await c.query('update task_queue set next = ? where id = ?', [insert_result.insertId, tail[0].id]);
        }
        res.redirect('/task');
    }).catch(err => {
        console.log(err);
        res.send(err);
    })
});

app.listen(8080, () => console.log('listening on 8080'));