export function LoadingSpinner() {
  return (
    <div className='flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <div className='relative w-16 h-16 mx-auto'>
          <div className='absolute inset-0 border-4 border-primary/30 rounded-full' />
          <div className='absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin' />
        </div>
        <p className='text-muted-foreground animate-pulse'>
          Loading converter...
        </p>
      </div>
    </div>
  )
}
