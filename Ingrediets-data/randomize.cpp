
int random_partition(int* array, int srt1, int last)
{
    srand(time(NULL));
    int pivotIndex = srt1 + rand() % (last-srt1+1);
    int pivot1 = array[pivotIndex];
    swap(array[pivotIndex], array[last]); 
    pivotIndex = last;
    int i = srt1 -1;
 
    for(int j=srt1; j<=last-1; j++)
    {
        if(array[j] <= pivot1)
        {
            i = i+1;
            swap(array[i], array[j]);
        }
    }
 
    swap(array[i+1], array[pivotIndex]);
    return i+1;
}
 
int random_selection(int* array, int srt1, int last, int k)
{
    if(srt1 == last)
        return array[srt1];
 
    if(k ==0) return -1;
 
    if(srt1 < last)
    {
 
    int mid = random_partition(array, srt1, last);
    i = mid - srt1 + 1;
    if(i == k)
        return array[mid];
    else if(k < i)
        return random_selection(array, srt1, mid-1, k);
    else 
        return random_selection(array, mid+1, last, k-i);
    }
 
}
void main()
{
    int A[] = {1,5,3,6,4};
    int loc = random_selection(A, 4);
}