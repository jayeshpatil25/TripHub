import React, { useState } from 'react';
import { useTripStore } from '../store/useTripStore';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';

const TodoList = ({ tripId }) => {
  const { trip, addTodo, toggleTodo, deleteTodo } = useTripStore();
  const [newTask, setNewTask] = useState('');

  const handleAddTodo = async () => {
    if (newTask.trim()) {
      await addTodo(tripId, newTask);
      setNewTask('');
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow border border-gray-100">
      <h3 className="text-lg font-bold mb-4 text-gray-800">📝 Trip Todos</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-semibold"
        >
          Add
        </button>
      </div>

      {trip?.todos?.length ? (
        <ul className="space-y-2">
          {trip.todos.map((todo) =>
  todo && todo._id ? (
    <li
      key={todo._id}
      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
    >
      <div
        className={`flex items-center gap-2 cursor-pointer ${
          todo.done ? 'line-through text-gray-400' : ''
        }`}
        onClick={() => toggleTodo(tripId, todo._id)}
      >
        <CheckIcon
          className={`w-5 h-5 ${todo.done ? 'text-green-500' : 'text-gray-300'}`}
        />
        <span className="text-sm">{todo.task}</span>
      </div>
      <button onClick={() => deleteTodo(tripId, todo._id)}>
        <TrashIcon className="w-4 h-4 text-red-400 hover:text-red-600" />
      </button>
    </li>
  ) : null
)}

        </ul>
      ) : (
        <p className="text-sm text-gray-500">No todos yet. Start planning!</p>
      )}
    </div>
  );
};

export default TodoList;
