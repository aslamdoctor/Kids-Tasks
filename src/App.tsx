import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';

// Define task types
interface Task {
  id: number;
  title: string;
  examples?: string[];
  specificTasks?: {
    aaliya?: string[];
    haidar?: string[];
  };
}

interface CompletedTask {
  taskId: number;
  date: string;
  childName: string;
}

const tasks: Task[] = [
  { id: 1, title: "15min exercise / go for walk" },
  { id: 2, title: "Draw one painting" },
  { id: 3, title: "Write anything in 2 pages in diary" },
  { id: 4, title: "Eat one vegetable meal" },
  { 
    id: 5, 
    title: "Read anything loudly for one hour everyday",
    examples: ["storybook", "magazine", "maths tables", "newspaper"]
  },
  { 
    id: 6, 
    title: "Help parents with one task",
    examples: [
      "lunch-dinner preparation",
      "clothes folding",
      "dish wash",
      "blankets folding",
      "chop vegetables",
      "water plant",
      "fill up water bottles"
    ]
  },
  { id: 7, title: "Play one board game together" },
  { 
    id: 8, 
    title: "Learn one new skill",
    specificTasks: {
      aaliya: ["cooking", "cleaning", "coding", "designing", "learn language"],
      haidar: ["self eating", "brush your teeth", "self bath", "paper craft", "water plants"]
    }
  }
];

const startDate = new Date('2025-04-13');
const endDate = new Date('2025-05-31');

function App() {
  const [selectedDate, setSelectedDate] = useState(startDate);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>(() => {
    const saved = localStorage.getItem('completedTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedChild, setSelectedChild] = useState<'aaliya' | 'haidar'>('aaliya');

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const toggleTask = (taskId: number) => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingTask = completedTasks.find(
      t => t.taskId === taskId && t.date === dateStr && t.childName === selectedChild
    );

    if (existingTask) {
      setCompletedTasks(completedTasks.filter(t => t !== existingTask));
    } else {
      setCompletedTasks([...completedTasks, { taskId, date: dateStr, childName: selectedChild }]);
    }
  };

  const isTaskCompleted = (taskId: number) => {
    return completedTasks.some(
      t => t.taskId === taskId && 
           t.date === format(selectedDate, 'yyyy-MM-dd') && 
           t.childName === selectedChild
    );
  };

  const getPoints = (childName: string) => {
    return completedTasks.filter(t => t.childName === childName).length;
  };

  const changeDate = (days: number) => {
    const newDate = addDays(selectedDate, days);
    if (newDate >= startDate && newDate <= endDate) {
      setSelectedDate(newDate);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800">
              Vacation Tasks Tracker
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedChild('aaliya')}
                className={`px-6 py-2 rounded-full text-lg font-semibold transition-all ${
                  selectedChild === 'aaliya'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Aaliya
              </button>
              <button
                onClick={() => setSelectedChild('haidar')}
                className={`px-6 py-2 rounded-full text-lg font-semibold transition-all ${
                  selectedChild === 'haidar'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Haidar
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 bg-gray-50 p-4 rounded-xl">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-200 rounded-full transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-semibold text-gray-700">
                {format(selectedDate, 'MMMM d, yyyy')}
              </span>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-200 rounded-full transition-all"
            >
              <ArrowRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map(task => (
              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 transition-all ${
                      isTaskCompleted(task.id)
                        ? 'text-green-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {task.title}
                    </h3>
                    {task.examples && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Examples:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.examples.map((example, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {task.specificTasks && task.specificTasks[selectedChild] && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Options:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.specificTasks[selectedChild].map((specificTask, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                            >
                              {specificTask}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">Total Points</h2>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-600">Aaliya</p>
                <p className="text-3xl font-bold text-gray-800">{getPoints('aaliya')}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-600">Haidar</p>
                <p className="text-3xl font-bold text-gray-800">{getPoints('haidar')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;