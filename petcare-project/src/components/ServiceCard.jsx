import React from 'react';
import Card from './Card';
import Badge from './Badge';

const ServiceCard = ({
  service,
  onBook = () => {},
  onEdit = null,
  onDelete = null,
  isAdmin = false,
}) => {
  return (
    <Card hover className="h-full flex flex-col">
      {/* Image */}
      {service.image && (
        <figure className="mb-4 -mx-6 -mt-6">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        </figure>
      )}

      {/* Content */}
      <div className="flex-1">
        <h2 className="card-title text-lg mb-2">{service.name}</h2>
        
        {/* Category Badge */}
        <div className="mb-3">
          <Badge variant="info" size="sm">
            {service.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Duration */}
        {service.duration && (
          <p className="text-xs text-gray-500 mb-4">
            ⏱️ {Math.floor(service.duration / 60)} ชม. {service.duration % 60} นาที
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t pt-4 flex justify-between items-center gap-2">
        <div className="text-2xl font-bold text-success">
          {service.price} ฿
        </div>
        
        {isAdmin ? (
          <div className="flex gap-2">
            {onEdit && (
              <button
                className="btn btn-xs btn-warning"
                onClick={() => onEdit(service._id)}
              >
                แก้ไข
              </button>
            )}
            {onDelete && (
              <button
                className="btn btn-xs btn-error"
                onClick={() => onDelete(service._id)}
              >
                ลบ
              </button>
            )}
          </div>
        ) : (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onBook(service._id)}
          >
            จอง
          </button>
        )}
      </div>
    </Card>
  );
};

export default ServiceCard;
