import { useState } from 'react';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import { Check, GripVertical, RotateCcw } from 'lucide-react';

interface Task {
  id: number;
  label: string;
  tag: string;
  tone: string;
}

const INITIAL: Task[] = [
  { id: 1, label: 'Design system tokens', tag: 'design', tone: 'text-accent bg-accent/15' },
  { id: 2, label: 'Auth + session flow', tag: 'backend', tone: 'text-accent bg-accent/15' },
  { id: 3, label: 'Checkout integration', tag: 'payments', tone: 'text-ink-2 bg-accent/15' },
  { id: 4, label: 'Mobile nav polish', tag: 'frontend', tone: 'text-accent bg-accent/15' },
];

export default function KanbanBoard() {
  const [todo, setTodo] = useState<Task[]>(INITIAL);
  const [done, setDone] = useState<Task[]>([]);

  function complete(task: Task) {
    setTodo((t) => t.filter((x) => x.id !== task.id));
    setDone((d) => [task, ...d]);
  }

  function reset() {
    setTodo(INITIAL);
    setDone([]);
  }

  return (
    <div className="flex h-full flex-col gap-2.5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.2em] text-ink-3 uppercase">
          drag to reorder
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-[10px] text-ink-3 transition-colors hover:text-ink-2"
        >
          <RotateCcw className="h-3 w-3" /> reset
        </button>
      </div>

      <Reorder.Group axis="y" values={todo} onReorder={setTodo} className="space-y-2">
        <AnimatePresence initial={false}>
          {todo.map((task) => (
            <Reorder.Item
              key={task.id}
              value={task}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
              className="card flex cursor-grab items-center gap-2.5 rounded-lg px-2.5 py-2 active:cursor-grabbing"
            >
              <GripVertical className="h-3.5 w-3.5 shrink-0 text-ink-3" />
              <span className="flex-1 truncate text-xs">{task.label}</span>
              <span className={`rounded px-1.5 py-0.5 text-[8px] ${task.tone}`}>
                {task.tag}
              </span>
              <button
                onClick={() => complete(task)}
                aria-label={`Complete ${task.label}`}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-rule text-transparent transition-colors hover:border-emerald-400 hover:text-emerald-400"
              >
                <Check className="h-3 w-3" />
              </button>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {done.length > 0 && (
        <div className="mt-auto border-t border-rule pt-2.5">
          <p className="mb-1.5 text-[10px] tracking-[0.2em] text-ink-3 uppercase">
            done · {done.length}
          </p>
          <div className="space-y-1.5">
            <AnimatePresence initial={false}>
              {done.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-2.5 py-1"
                >
                  <Check className="h-3 w-3 shrink-0 text-accent" />
                  <span className="truncate text-xs text-ink-3 line-through">{task.label}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
