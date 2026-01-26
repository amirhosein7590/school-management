import React, { memo } from "react";

const Item = memo(({ fullName, count }) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-800 truncate max-w-[70%]">{fullName}</span>

      {count && (
        <span className="font-medium text-gray-600">
          {count}
          <span className="text-xs text-gray-400"> بار</span>
        </span>
      )}
    </div>
  );
});

function AttendanceCard({ data, entityName, title }) {
  const isComponentRender = Array.isArray(data)
    ? data?.length > 0
    : data?.[entityName];

  return (
    <div className="w-full min-h-[140px] rounded-2xl bg-white border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow px-5 py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-sm sans-bold text-gray-900 leading-tight">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {isComponentRender ? (
          Array.isArray(data) ? (
            data.map((entity) => (
              <Item
                key={`${entity?.[entityName]?._id}-${entity?.count}`}
                count={entity?.count}
                fullName={`${entity?.[entityName]?.firstName} ${entity?.[entityName]?.lastName}`}
              />
            ))
          ) : (
            <Item
              count={data?.count}
              fullName={`${data?.[entityName]?.firstName} ${data?.[entityName]?.lastName}`}
            />
          )
        ) : (
          <div className="py-6 text-center text-sm text-gray-400">
            موردی برای نمایش وجود ندارد
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(AttendanceCard);
