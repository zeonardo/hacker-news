import { formatDate } from './dateFormatter';

describe('formatDate', () => {
  it('should format a timestamp into a readable date string', () => {
    const timestamp = 1633072800; // Example timestamp
    const date = new Date(timestamp * 1000);
    const expectedDate = date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    expect(formatDate(timestamp)).toBe(expectedDate);
  });

  it('should handle invalid timestamps gracefully', () => {
    const invalidTimestamp = NaN; // Invalid timestamp
    const expectedDate = new Date(NaN).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    expect(formatDate(invalidTimestamp)).toBe(expectedDate);
  });
});
