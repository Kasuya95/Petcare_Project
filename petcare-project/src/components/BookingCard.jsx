import React from 'react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const BookingCard = ({
  booking,
  onCancel = null,
  onUndoCancel = null,
  onPayment = null,
  onViewSlip = null,
  showActions = true,
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="text-success" size={20} />;
      case 'PENDING':
        return <Clock className="text-warning" size={20} />;
      case 'CANCELLED':
        return <XCircle className="text-error" size={20} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success">ชำระแล้ว</Badge>;
      case 'PENDING':
        return <Badge variant="warning">รอชำระ</Badge>;
      case 'CANCELLED':
        return <Badge variant="error">ยกเลิก</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card hover>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(booking.status)}
            <h3 className="text-lg font-bold">{booking.serviceId?.name}</h3>
          </div>
          {getStatusBadge(booking.status)}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-success">
            {booking.serviceId?.price} ฿
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-500 text-xs font-semibold">สัตว์เลี้ยง</p>
          <p className="font-semibold">{booking.petName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold">วันที่</p>
          <p className="font-semibold">
            {new Date(booking.bookingDate).toLocaleDateString('th-TH')}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold">เวลา</p>
          <p className="font-semibold">{booking.bookingTime}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold">ระยะเวลา</p>
          <p className="font-semibold">
            {Math.floor(booking.serviceId?.duration / 60)} ชม.
          </p>
        </div>
      </div>

      {booking.note && (
        <div className="bg-base-200 p-3 rounded mb-4">
          <p className="text-xs text-gray-600">
            <b>หมายเหตุ:</b> {booking.note}
          </p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 flex-wrap">
          {booking.status === 'PENDING' && onPayment && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onPayment(booking._id)}
            >
              ชำระเงิน
            </Button>
          )}
          {booking.status === 'PAID' && (
            <>
              {booking.slipUrl && onViewSlip && (
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => onViewSlip(booking._id)}
                >
                  ดูสลิป
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="error"
                  size="sm"
                  onClick={() => onCancel(booking._id)}
                >
                  ยกเลิก
                </Button>
              )}
            </>
          )}
          {booking.status === 'CANCELLED' && onUndoCancel && (
            <Button
              variant="info"
              size="sm"
              onClick={() => onUndoCancel(booking._id)}
            >
              ยกเลิกการยกเลิก
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default BookingCard;
