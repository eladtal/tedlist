import React from 'react';
import { motion } from 'framer-motion';

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
}

interface QuestBoardProps {
  quests: Quest[];
}

const QuestBoard: React.FC<QuestBoardProps> = ({ quests }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Beginner Quests</h2>
      <div className="space-y-4">
        {quests.map((quest) => (
          <motion.div
            key={quest.id}
            className={`p-4 rounded-lg border ${
              quest.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{quest.title}</h3>
                <p className="text-sm text-gray-600">{quest.description}</p>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-1">🧸</span>
                <span className="font-medium text-pink-600">+{quest.reward}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-pink-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-600">
                  Progress: {quest.progress}/{quest.target}
                </span>
                {quest.completed && (
                  <span className="text-sm text-green-600 font-medium">
                    Completed! ✨
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuestBoard; 