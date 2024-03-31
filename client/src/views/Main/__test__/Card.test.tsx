jest.mock("../Main.css", () => ({})); // Mock the CSS file
import { render, fireEvent, screen } from "@testing-library/react";
import Card from "../Card";

// Mock function for onClick prop
const onClickMock = jest.fn();

describe("Card Component", () => {
  test("renders card with correct text and image", () => {
    render(<Card text="Test Text" image="pen.png" onClick={onClickMock} />);

    // Assert text content
    expect(screen.getByText("Test Text")).toBeInTheDocument();

    // Assert image source
    expect(screen.getByAltText("")).toHaveAttribute(
      "src",
      "pen.png"
    );
  });

  test("calls onClick prop when clicked", () => {
    render(<Card text="Test Text" image="pen.png" onClick={onClickMock} />);
    const card = screen.getByTestId("card");

    // Simulate click
    fireEvent.click(card);

    // Expect onClick to be called
    expect(onClickMock).toHaveBeenCalled();
  });
});
