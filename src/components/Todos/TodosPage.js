import React, { Component } from "react";
import { withFirebase } from '../Firebase';
import { Checkbox, Form, Input, Button, Container, List } from "semantic-ui-react";

class TodosPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentTodo: "",
            todos: [],
        };
    }
    componentDidMount() {
        this.loadTodos();
    }
    componentWillUnmount() {
        this.props.firebase.todos().off();
    }
    loadTodos = () => {
        this.setState({ loading: true });
        this.props.firebase
            .todos()
            .orderByChild('createdAt')
            .on('value', snapshot => {
                const todosObject = snapshot.val();
                if (todosObject) {
                    const todosList = Object.keys(todosObject).map(key => ({
                        ...todosObject[key],
                        uid: key,
                    }));
                    this.setState({
                        todos: todosList,
                        loading: false,
                    });
                } else {
                    this.setState({ todos: [], loading: false });
                }
            });
    };

    deleteTodo = uid => {
        this.props.firebase.todo(uid).remove();
    };

    updateTodo = async (todo) => {
        const { text, uid, completed: complete } = todo;
        const completed = !complete;
        await this.props.firebase.todo(uid).update({
            text: text,
            completed: completed,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
        const update = this.state.todos.map(todo => {
            if (todo.uid === uid) {
                return {
                    ...todo,
                    completed,
                    text
                }
            }
            return todo;
        });
        this.setState({ todos: update })
    };

    addTodo = () => {
        this.props.firebase.todos().push({
            text: this.state.currentTodo,
            completed: false,
            createdAt: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    handleChange = (evt) => {
        this.setState({ currentTodo: evt.target.value });
    }
    render() {
        const { todos, currentTodo } = this.state;
        return (
            <Container textAlign="center">

                <h1>Todos</h1>
                {/* Show Todos */}
                <List>
                    {todos.map(todo => (
                        <List.Item key={todo.uid}>
                            <Checkbox label={todo.text} onClick={() => this.updateTodo(todo)} checked={todo.completed}
                                style={todo.completed ? { textDecoration: "line-through" } : { textDecoration: "none" }} />
                        </List.Item>
                    ))}
                </List>
                {/* Add Todos */}
                <Form>
                    <Input placeholder="Todo..." name="todo" autoFocus onChange={this.handleChange} value={currentTodo} />
                    <Button basic onClick={this.addTodo}>
                        Add Todo
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default withFirebase(TodosPage);
