import { VitalsData } from '@/types/scan';

export class ScanResultValidator {
  static validate(data: VitalsData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.heartRate < 30 || data.heartRate > 220) {
      errors.push('Heart rate out of physiological range');
    }

    if (data.spo2 < 70 || data.spo2 > 100) {
      errors.push('SpO2 value invalid');
    }

    if (data.bloodPressure.systolic < 60 || data.bloodPressure.systolic > 250) {
      errors.push('Systolic pressure out of range');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
