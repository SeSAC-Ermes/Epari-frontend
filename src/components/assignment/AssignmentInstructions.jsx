import {AssignmentContainer} from "./AssignmentContainer.jsx";

/**
 *  임시로 만들어둔 AssignmentContainer 컴포넌트를 불러오는 더미 컴포넌트
 */
export const AssignmentInstructions = ({instructions}) => (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h3 className="font-bold mb-6">과제안내</h3>

      <div className="flex justify-center items-center gap-4 mb-6">
        <AssignmentContainer logo="react" arrows="right"/>
        <AssignmentContainer logo="node" arrows="right"/>
        <AssignmentContainer logo="mongodb"/>
      </div>

      <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
        {instructions}
      </div>
    </div>
);
