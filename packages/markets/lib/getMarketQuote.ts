import Decimal from 'decimal.js'
import { getAmmAccount } from '@play-money/accounts/lib/getAmmAccount'
import { quote } from '@play-money/amms/lib/maniswap-v1.1'
import { getBalances } from '@play-money/finance/lib/getBalances'

export async function getMarketQuote({
  marketId,
  optionId,
  amount,
  isBuy,
}: {
  marketId: string
  optionId: string
  amount: Decimal
  isBuy: boolean
}) {
  const ammAccount = await getAmmAccount({ marketId })
  const ammBalances = await getBalances({ accountId: ammAccount.id, marketId })

  const targetBalance = ammBalances.find(({ assetId }) => assetId === optionId)
  const optionBalances = ammBalances.filter(({ assetType }) => assetType === 'MARKET_OPTION')
  const optionsShares = optionBalances.map(({ amount }) => amount)

  // TODO: Change to multi-step quote to account for limit orders
  const { probability, shares } = await quote({
    amount,
    probability: isBuy ? new Decimal(0.99) : new Decimal(0.01),
    targetShare: targetBalance!.amount,
    shares: optionsShares,
  })

  return {
    probability,
    shares,
  }
}
