import { useEffect, useMemo, useState, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterForm } from "../components/FilterForm";
import { StarClassCard } from "../components/StarClassCard";
import { MASS_MAX, MASS_MIN } from "../constants";
import { getPublishedStarClasses } from "../modules/starClassesMock";

const parseMass = (value: string | null, fallback: number): number => {
    if (value === null || value === "") {
        return fallback;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.min(Math.max(numeric, MASS_MIN), MASS_MAX);
};

export const CatalogPage: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const appliedMin = parseMass(searchParams.get("min"), MASS_MIN);
    const appliedMax = parseMass(searchParams.get("max"), MASS_MAX);

    const [minValue, setMinValue] = useState(appliedMin);
    const [maxValue, setMaxValue] = useState(appliedMax);

    useEffect(() => {
        document.title = "Каталог спектральных классов";
    }, []);

    useEffect(() => {
        setMinValue(appliedMin);
        setMaxValue(appliedMax);
    }, [appliedMin, appliedMax]);

    const items = useMemo(() => getPublishedStarClasses(appliedMin, appliedMax), [appliedMin, appliedMax]);

    const handleSubmit = () => {
        setSearchParams({ min: String(minValue), max: String(maxValue) });
    };

    return (
        <section className="catalog-screen">
            <div className="catalog-header">
                <h1 className="catalog-title">Каталог</h1>
                <FilterForm
                    minValue={minValue}
                    maxValue={maxValue}
                    onMinChange={setMinValue}
                    onMaxChange={setMaxValue}
                    onSubmit={handleSubmit}
                />
            </div>

            <div className="catalog-grid">
                {items.length === 0 ? (
                    <p className="catalog-empty">По заданным параметрам ничего не найдено.</p>
                ) : (
                    items.map((item) => (
                        <StarClassCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            imageUrl={item.imageUrl}
                            likeCount={item.likeCount}
                        />
                    ))
                )}
            </div>
        </section>
    );
};
