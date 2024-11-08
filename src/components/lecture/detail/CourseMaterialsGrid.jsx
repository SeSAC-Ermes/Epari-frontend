import React from 'react';
import { FileText } from 'lucide-react';

const CourseMaterialsGrid = ({ materials }) => (
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-sm font-medium mb-4">시험 및 과제</h3>
        <div className="space-y-2">
          {materials.map(material => (
              <div key={material.id} className="flex items-center space-x-2 text-sm">
                <FileText size={16} className="text-gray-400"/>
                <span>{material.title}</span>
                <span className="text-gray-400 ml-auto">{material.date}</span>
              </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h3 className="text-sm font-medium mb-4">자료실</h3>
        <div className="space-y-2">
          {materials.map(material => (
              <div key={material.id} className="flex items-center space-x-2 text-sm">
                <FileText size={16} className="text-gray-400"/>
                <span className="text-blue-500 cursor-pointer hover:underline">
              {material.file}
            </span>
                <span className="text-gray-400 ml-auto">{material.date}</span>
              </div>
          ))}
        </div>
      </div>
    </div>
);

export default CourseMaterialsGrid;
