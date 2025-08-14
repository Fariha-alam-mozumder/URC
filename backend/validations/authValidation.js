import { Vine } from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";

const vine = new Vine();
vine.errorReporter = new CustomErrorReporter();

// Correct approach: Remove the regex from schema since we handle it in controller
export const registerSchema = vine.object({
  name: vine.string().minLength(2).maxLength(150),
  email: vine.string().email(),
  password: vine.string().minLength(2).maxLength(100).confirmed(),
  password_confirmation: vine.string(),
  role: vine.enum(["GENERALUSER", "TEACHER", "STUDENT"]),
  department_name: vine.string().optional(),
  roll_number: vine.string().optional(), // Just make it optional, validation handled in controller
  designation: vine.string().optional(),
});

export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string(),
});

// Helper function for roll number validation (to be called in controller)
export const validateRollNumber = (rollNumber, department) => {
  if (!rollNumber) return null;

  // Basic 8-digit check
  if (!/^\d{8}$/.test(rollNumber)) {
    return "Roll number must be exactly 8 numeric digits";
  }

  const session = parseInt(rollNumber.substring(0, 2));
  const fixedDigits = rollNumber.substring(2, 4);
  const deptCode = rollNumber.substring(4, 5);
  const fixedSixth = rollNumber.substring(5, 6);
  const serialNumber = parseInt(rollNumber.substring(6, 8));

  // Session validation (01-99)
  if (session < 1 || session > 99) {
    return "Invalid session in roll number (first 2 digits should be 01-99)";
  }

  // 3rd and 4th digits must be "70"
  if (fixedDigits !== "70") {
    return '3rd and 4th digits must be "70"';
  }

  // 5th digit: 1 for CSE, 2 for EEE
  if (deptCode !== "1" && deptCode !== "2") {
    return '5th digit must be "1" for CSE or "2" for EEE';
  }

  // 6th digit must be "0"
  if (fixedSixth !== "0") {
    return '6th digit must be "0"';
  }

  // Serial number validation (01-99)
  if (serialNumber < 1 || serialNumber > 99) {
    return "Serial number must be between 01-99 (last 2 digits)";
  }

  return null; // Valid
};