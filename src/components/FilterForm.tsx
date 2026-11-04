import type { ChangeEvent, FC, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { MASS_MAX, MASS_MIN } from "../constants";

interface Props {
    minValue: number;
    maxValue: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
    onSubmit: () => void;
}

export const FilterForm: FC<Props> = ({ minValue, maxValue, onMinChange, onMaxChange, onSubmit }) => {
    const handleMin = (event: ChangeEvent<HTMLInputElement>) => {
        onMinChange(Math.min(Number(event.target.value), maxValue));
    };

    const handleMax = (event: ChangeEvent<HTMLInputElement>) => {
        onMaxChange(Math.max(Number(event.target.value), minValue));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <Form className="search-block" onSubmit={handleSubmit}>
            <div className="search-label">ПОИСК ПО МАССЕ:</div>
            <div className="range-row">
                <div className="range-slider-wrap">
                    <div className="range-values">
                        <span>{minValue} M⨀</span>
                        <span>{maxValue} M⨀</span>
                    </div>
                    <div className="range-slider">
                        <Form.Range
                            name="min"
                            className="range-input"
                            min={MASS_MIN}
                            max={MASS_MAX}
                            step={0.1}
                            value={minValue}
                            onChange={handleMin}
                        />
                        <Form.Range
                            name="max"
                            className="range-input"
                            min={MASS_MIN}
                            max={MASS_MAX}
                            step={0.1}
                            value={maxValue}
                            onChange={handleMax}
                        />
                    </div>
                </div>
                <Button type="submit" className="btn-gold search-btn">
                    Найти
                </Button>
            </div>
        </Form>
    );
};
