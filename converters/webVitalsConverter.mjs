export default async (data) => {
    return {
        CUMULATIVE_LAYOUT_SHIFT_SCORE: data.metrics["CUMULATIVE_LAYOUT_SHIFT_SCORE"].category,
        EXPERIMENTAL_TIME_TO_FIRST_BYTE: data.metrics["EXPERIMENTAL_TIME_TO_FIRST_BYTE"].category,
        FIRST_CONTENTFUL_PAINT_MS: data.metrics["FIRST_CONTENTFUL_PAINT_MS"].category,
        FIRST_INPUT_DELAY_MS: data.metrics["FIRST_INPUT_DELAY_MS"].category,
        INTERACTION_TO_NEXT_PAINT: data.metrics["INTERACTION_TO_NEXT_PAINT"].category,
        LARGEST_CONTENTFUL_PAINT_MS: data.metrics["LARGEST_CONTENTFUL_PAINT_MS"].category,
        OVERALL: data.overall_category
    }
}