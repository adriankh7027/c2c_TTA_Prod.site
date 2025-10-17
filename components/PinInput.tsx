import React, { useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

const PinInput: React.FC<PinInputProps> = ({ value, onChange, length = 4 }) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);
  
  // This effect ensures that if the parent component clears the value (e.g., on error),
  // the individual input boxes are also cleared.
  useEffect(() => {
    const pinDigits = value.split('');
    inputsRef.current.forEach((input, index) => {
      if (input) {
        input.value = pinDigits[index] || '';
      }
    });
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value: inputValue } = e.target;
    if (!/^\d?$/.test(inputValue)) {
      e.target.value = ''; // Clear non-digit input
      return;
    }

    const newPin = [...value.slice(0, index), inputValue, ...value.slice(index + 1)].join('');
    onChange(newPin.slice(0, length));


    // Move focus to the next input if a digit is entered
    if (inputValue && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to the previous input on backspace if the current input is empty
    if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    if (pasteData.length === length) {
      onChange(pasteData);
      pasteData.split('').forEach((char, index) => {
        if (inputsRef.current[index]) {
          inputsRef.current[index].value = char;
        }
      });
      inputsRef.current[length - 1].focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-4" onPaste={handlePaste}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          // FIX: The ref callback function must not return a value. Changed from an implicit return arrow function to a block body.
          ref={(el) => { inputsRef.current[index] = el!; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-semibold bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      ))}
    </div>
  );
};

export default PinInput;
