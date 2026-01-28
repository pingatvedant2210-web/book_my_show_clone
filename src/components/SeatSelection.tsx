import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SeatSelectionProps {
  totalSeats: number;
  availableSeats: number;
  seatsToSelect: number;
  onSeatsSelected: (seats: string[]) => void;
  selectedSeats: string[];
}

const SeatSelection = ({
  totalSeats,
  availableSeats,
  seatsToSelect,
  onSeatsSelected,
  selectedSeats,
}: SeatSelectionProps) => {
  // Generate seat layout - 10 seats per row
  const seatsPerRow = 10;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  
  // Generate "booked" seats randomly based on available seats
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(() => {
    const booked = new Set<string>();
    const bookedCount = totalSeats - availableSeats;
    const allSeats: string[] = [];
    
    // Generate all seat IDs
    for (let row = 0; row < totalRows; row++) {
      const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        if ((row * seatsPerRow + seat) <= totalSeats) {
          allSeats.push(`${rowLetter}${seat}`);
        }
      }
    }
    
    // Randomly mark some as booked
    const shuffled = [...allSeats].sort(() => Math.random() - 0.5);
    for (let i = 0; i < bookedCount && i < shuffled.length; i++) {
      booked.add(shuffled[i]);
    }
    
    return booked;
  });

  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.has(seatId)) return;
    
    const newSelected = [...selectedSeats];
    const index = newSelected.indexOf(seatId);
    
    if (index > -1) {
      // Deselect seat
      newSelected.splice(index, 1);
    } else if (newSelected.length < seatsToSelect) {
      // Select seat if under limit
      newSelected.push(seatId);
    }
    
    onSeatsSelected(newSelected);
  };

  const getSeatStatus = (seatId: string): 'booked' | 'available' | 'selected' => {
    if (bookedSeats.has(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  return (
    <div className="w-full">
      {/* Screen indicator */}
      <div className="mb-8">
        <div className="w-3/4 mx-auto h-2 bg-primary/30 rounded-t-full mb-2" />
        <p className="text-center text-sm text-muted-foreground">SCREEN</p>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col items-center gap-2 mb-6">
        {Array.from({ length: totalRows }, (_, rowIndex) => {
          const rowLetter = String.fromCharCode(65 + rowIndex);
          const seatsInThisRow = Math.min(seatsPerRow, totalSeats - rowIndex * seatsPerRow);
          
          return (
            <div key={rowLetter} className="flex items-center gap-1">
              {/* Row label */}
              <span className="w-6 text-xs font-medium text-muted-foreground">{rowLetter}</span>
              
              {/* Seats */}
              <div className="flex gap-1">
                {Array.from({ length: seatsInThisRow }, (_, seatIndex) => {
                  const seatNumber = seatIndex + 1;
                  const seatId = `${rowLetter}${seatNumber}`;
                  const status = getSeatStatus(seatId);
                  
                  // Add aisle gap after seat 5
                  const hasAisleAfter = seatNumber === 5 && seatsInThisRow > 5;
                  
                  return (
                    <div key={seatId} className={cn("flex", hasAisleAfter && "mr-4")}>
                      <button
                        onClick={() => handleSeatClick(seatId)}
                        disabled={status === 'booked'}
                        className={cn(
                          "w-8 h-8 rounded-t-lg text-xs font-medium transition-all",
                          "flex items-center justify-center",
                          status === 'booked' && "bg-muted text-muted-foreground cursor-not-allowed",
                          status === 'available' && "border-2 border-green-500 text-green-500 hover:bg-green-500/10",
                          status === 'selected' && "bg-primary text-primary-foreground border-2 border-primary"
                        )}
                        title={status === 'booked' ? 'Seat unavailable' : `Seat ${seatId}`}
                      >
                        {seatNumber}
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {/* Row label (right side) */}
              <span className="w-6 text-xs font-medium text-muted-foreground">{rowLetter}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg border-2 border-green-500" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-primary" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-muted" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Selection info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Select {seatsToSelect} seat{seatsToSelect > 1 ? 's' : ''} 
          {selectedSeats.length > 0 && (
            <span className="text-foreground font-medium">
              {' '}• Selected: {selectedSeats.sort().join(', ')}
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {seatsToSelect - selectedSeats.length} more seat{seatsToSelect - selectedSeats.length !== 1 ? 's' : ''} to select
        </p>
      </div>
    </div>
  );
};

export default SeatSelection;
