import React from 'react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const PaymentCard = ({
  payment,
  onViewSlip = null,
  onApprove = null,
  onReject = null,
  showActions = false,
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning" size="lg">รอตรวจสอบ</Badge>;
      case 'APPROVED':
        return <Badge variant="success" size="lg">อนุมัติแล้ว</Badge>;
      case 'PAID':
        return <Badge variant="success" size="lg">ชำระแล้ว</Badge>;
      case 'REJECTED':
        return <Badge variant="error" size="lg">ปฏิเสธ</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card hover>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold mb-2">
            {payment.user?.username || payment.bookingId?.userId?.username}
          </h3>
          {getStatusBadge(payment.status)}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-success">
            {payment.amount || payment.price} ฿
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-500 text-xs font-semibold">บริการ</p>
          <p className="font-semibold">
            {payment.bookingId?.serviceId?.name || payment.service?.name}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold">สัตว์เลี้ยง</p>
          <p className="font-semibold">{payment.bookingId?.petName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-semibold">วันที่จอง</p>
          <p className="font-semibold">
            {payment.bookingId?.bookingDate
              ? new Date(payment.bookingId.bookingDate).toLocaleDateString('th-TH')
              : '-'}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {payment.slipUrl && onViewSlip && (
          <Button
            variant="info"
            size="sm"
            icon={Eye}
            onClick={() => onViewSlip(payment)}
          >
            ดูสลิป
          </Button>
        )}

        {showActions && payment.status === 'PENDING' && (
          <>
            <Button
              variant="success"
              size="sm"
              icon={CheckCircle}
              onClick={() => onApprove(payment)}
            >
              อนุมัติ
            </Button>
            <Button
              variant="error"
              size="sm"
              icon={XCircle}
              onClick={() => onReject(payment)}
            >
              ปฏิเสธ
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default PaymentCard;
