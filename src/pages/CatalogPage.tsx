import { useEffect, type FC } from "react";
import { Alert } from "react-bootstrap";
import { FilterForm } from "../components/FilterForm";
import { StarClassCard } from "../components/StarClassCard";
import {
    deleteStarClass,
    getStarClassesList,
    setMaxMass,
    setMinMass,
} from "../slices/starClassesSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export const CatalogPage: FC = () => {
    const dispatch = useAppDispatch();
    const { minMass, maxMass, items, error } = useAppSelector((state) => state.starClasses);
    const { isAuthenticated, username } = useAppSelector((state) => state.user);

    useEffect(() => {
        document.title = "Каталог спектральных классов";
        dispatch(getStarClassesList());
    }, [dispatch]);

    return (
        <section className="catalog-screen">
            <div className="catalog-header">
                <h1 className="catalog-title">Каталог</h1>
                {isAuthenticated && <p className="catalog-user">Вы вошли как {username}</p>}
                <FilterForm
                    minValue={minMass}
                    maxValue={maxMass}
                    onMinChange={(value) => dispatch(setMinMass(value))}
                    onMaxChange={(value) => dispatch(setMaxMass(value))}
                    onSubmit={() => dispatch(getStarClassesList())}
                />
            </div>

            {error && (
                <Alert variant="danger" className="catalog-alert">
                    {error}
                </Alert>
            )}

            <div className="catalog-grid">
                {items.length === 0 && !error ? (
                    <p className="catalog-empty">По заданным параметрам ничего не найдено.</p>
                ) : (
                    items.map((item) => (
                        <StarClassCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            imageUrl={item.imageUrl}
                            likeCount={item.likeCount}
                            onDelete={
                                isAuthenticated && item.isMine === 1
                                    ? () => dispatch(deleteStarClass(item.id))
                                    : undefined
                            }
                        />
                    ))
                )}
            </div>
        </section>
    );
};
