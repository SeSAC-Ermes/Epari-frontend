import React from 'react';
import StatCard from "./StatCard";
import { Ban, CheckCircle2, Clock, Stethoscope, Users } from 'lucide-react';

/**
 * 출석 관련 전체 통계를 카드 그룹으로 표시하는 컨테이너 컴포넌트.
 */
const StatCards = ({ stats }) => {
  return (
      <div className="grid grid-cols-5 gap-4">
        <StatCard
            icon={<Users className="w-5 h-5 text-gray-500"/>}
            label="총원"
            count={stats.total}
            bgColor="white"
        />
        <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-green-500"/>}
            label="출석"
            count={stats.present}
            bgColor="green"
        />
        <StatCard
            icon={<Clock className="w-5 h-5 text-orange-500"/>}
            label="지각"
            count={stats.late}
            bgColor="red"
        />
        <StatCard
            icon={<Stethoscope className="w-5 h-5 text-gray-500"/>}
            label="병결"
            count={stats.sick}
            bgColor="gray"
        />
        <StatCard
            icon={<Ban className="w-5 h-5 text-blue-500"/>}
            label="결석"
            count={stats.absent}
            bgColor="blue"
        />
      </div>
  );
};

export default StatCards;
