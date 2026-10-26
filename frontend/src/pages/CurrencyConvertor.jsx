import React, { useState, useEffect } from 'react';

function CurrencyConvertor() {
    const [rates, setRates] = useState({});
    const [ratesFetched, setRatesFetched] = useState(false);
    const [amount, setAmount] = useState('1');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [output, setOutput] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const getRates = async () => {
            try {
                const response = await fetch(
                    'https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD'
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch exchange rates.');
                }

                const data = await response.json();

                if (data.result === 'success') {
                    setRates(data.conversion_rates);
                    setRatesFetched(true);
                } else {
                    throw new Error('Unable to retrieve exchange rates.');
                }
            } catch (err) {
                setError(err.message || 'Something went wrong.');
            }
        };

        getRates();
    }, []);

    const calculateOutput = () => {
        const numericAmount = Number(amount);

        if (
            amount.trim() === '' ||
            !Number.isFinite(numericAmount) ||
            numericAmount < 0
        ) {
            setError('Please enter a valid, non-negative amount.');
            setOutput(null);
            return;
        }

        if (!rates[fromCurrency] || !rates[toCurrency]) {
            setError('Please select valid currencies.');
            setOutput(null);
            return;
        }

        const currencyRate =
            rates[toCurrency] / rates[fromCurrency];

        setOutput((numericAmount * currencyRate).toFixed(2));
        setError('');
    };

    return (
        <div className="container">
            <div className="input-amount">
                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" min="0" step="any" value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <div className="input-from">
                <label htmlFor="from">From:</label>
                <select id="from" value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    disabled={!ratesFetched}
                >
                    {Object.keys(rates).map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>

            <div className="input-to">
                <label htmlFor="to">To:</label>
                <select id="to" value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    disabled={!ratesFetched}
                >
                    {Object.keys(rates).map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>

            <button className="btn" onClick={calculateOutput} disabled={!ratesFetched}>
                Calculate
            </button>

            {error && <p className="error">{error}</p>}

            <div className="output">
                <label>
                    Output: {output !== null ? output : '--'}
                    {output !== null ? ` ${toCurrency}` : ''}
                </label>
            </div>
        </div>
    );
}

export default CurrencyConvertor;
