import {
  DeliveryTimeDto,
  DeliveryTimeUnitEnum,
} from '@libs/nebula/dto/legacy-api/legacy-marketplace-productSpec.dto';

export const deliveryTimetoString = (deliveryTime: DeliveryTimeDto) => {
  const indexOfUnit = Object.values(DeliveryTimeUnitEnum).indexOf(
    deliveryTime.unit,
  );
  const unitName = Object.keys(DeliveryTimeUnitEnum)[indexOfUnit];

  const deliveryTimeString = `${deliveryTime.duration} ${unitName}`;

  return deliveryTime.duration > 1
    ? `${deliveryTimeString}s`
    : deliveryTimeString;
};
