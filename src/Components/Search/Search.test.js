import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import Search from "./Search";
import configureStore from 'redux-mock-store';
import { setSearchName } from "../../redux/search/searchAction";

const mockStore = configureStore([]);

describe("Search Component", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            search: { searchName: '' }
        });
        // Clear any previous DOM modifications
        document.body.innerHTML = '';
    });

    test("renders search component", () => {
        renderWithProviders(<Search />);
        expect(screen.getByText("Ricky & Morty")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search Characters")).toBeInTheDocument();
    });

    test("handles search input change", () => {
        renderWithProviders(<Search />, {
            store: store
        });
        const input = screen.getByPlaceholderText("Search Characters");
        fireEvent.change(input, { target: { value: "Rick" } });
        const actions = store.getActions();
        expect(actions[0]).toEqual(setSearchName("Rick"));
    });

    test("handles form submission", () => {
        const mockScrollIntoView = jest.fn();
        const section = document.createElement('div');
        section.id = 'characters-section';
        section.scrollIntoView = mockScrollIntoView;
        document.body.appendChild(section);

        renderWithProviders(<Search />);
        
        const form = screen.getByRole("form");
        fireEvent.submit(form);
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    test("renders navigation links", () => {
        renderWithProviders(<Search />);
        expect(screen.getByText("Characters")).toBeInTheDocument();
        expect(screen.getByText("Episodes")).toBeInTheDocument();
        expect(screen.getByText("Location")).toBeInTheDocument();
    });
});
